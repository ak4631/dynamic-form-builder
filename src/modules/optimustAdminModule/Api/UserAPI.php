<?php

namespace Optimust\Admin\Api;

use Optimust\Admin\Api\Model\UserModel;
use Optimust\Admin\Dto\UserSearchFilterParams;
use Optimust\Admin\Service\UserService;
use Optimust\Admin\Traits\Service\UserServiceTrait;
use Optimust\Core\Api\CommonParams;
use Optimust\Core\Api\V1\CrudEndpoint;
use Optimust\Core\Api\V1\Endpoint;
use Optimust\Core\Api\V1\EndpointCollectionResult;
use Optimust\Core\Api\V1\EndpointResourceResult;
use Optimust\Core\Api\V1\Model\ArrayModel;
use Optimust\Core\Api\V1\ParameterBag;
use Optimust\Core\Api\V1\RequestParams;
use Optimust\Core\Api\V1\Validator\ParamRule;
use Optimust\Core\Api\V1\Validator\ParamRuleCollection;
use Optimust\Core\Api\V1\Validator\Rule;
use Optimust\Core\Api\V1\Validator\Rules;
use Optimust\Core\Api\V1\Validator\Rules\EntityUniquePropertyOption;
use Optimust\Core\Traits\Auth\AuthUserTrait;
use Optimust\Core\Traits\Service\DateTimeHelperTrait;
use Optimust\Entity\User;

class UserAPI extends Endpoint implements CrudEndpoint
{
    use UserServiceTrait;
    use DateTimeHelperTrait;
    use AuthUserTrait;

    public const PARAMETER_USERNAME = 'username';
    public const PARAMETER_PASSWORD = 'password';
    public const PARAMETER_USER_ROLE_ID = 'userRoleId';
    public const PARAMETER_STATUS = 'status';
    public const PARAMETER_CHANGE_PASSWORD = 'changePassword';

    public const FILTER_USERNAME = 'username';
    public const FILTER_USER_ROLE_ID = 'userRoleId';
    public const FILTER_STATUS = 'status';

    public const PARAM_RULE_USERNAME_MIN_LENGTH = UserService::USERNAME_MIN_LENGTH;
    public const PARAM_RULE_USERNAME_MAX_LENGTH = UserService::USERNAME_MAX_LENGTH;
    public const PARAM_RULE_PASSWORD_MAX_LENGTH = 64;

    /**
     * @OA\Get(
     *     path="/api/v1/admin/users/{id}",
     *     tags={"Admin/Users"},
     *     @OA\PathParameter(
     *         name="id",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="data",
     *                 ref="#/components/schemas/Admin-UserModel"
     *             ),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     ),
     *     @OA\Response(response="404", ref="#/components/responses/RecordNotFound")
     * )
     *
     * @inheritDoc
     */
    public function getOne(): EndpointResourceResult
    {
        $userId = $this->getRequestParams()->getInt(RequestParams::PARAM_TYPE_ATTRIBUTE, CommonParams::PARAMETER_ID);
        $user = $this->getUserService()->getSystemUser($userId);
        $this->throwRecordNotFoundExceptionIfNotExist($user, User::class);

        return new EndpointResourceResult(UserModel::class, $user);
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(CommonParams::PARAMETER_ID, new Rule(Rules::POSITIVE)),
        );
    }

    /**
     * @OA\Get(
     *     path="/api/v1/admin/users",
     *     tags={"Admin/Users"},
     *     @OA\Parameter(
     *         name="username",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="userRoleId",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="status",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="boolean")
     *     ),
     *     @OA\Parameter(
     *         name="sortField",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="string", enum=UserSearchFilterParams::ALLOWED_SORT_FIELDS)
     *     ),
     *     @OA\Parameter(ref="#/components/parameters/sortOrder"),
     *     @OA\Parameter(ref="#/components/parameters/limit"),
     *     @OA\Parameter(ref="#/components/parameters/offset"),
     *     @OA\Response(
     *         response="200",
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(ref="#/components/schemas/Admin-UserModel")
     *             ),
     *             @OA\Property(property="meta",
     *                 type="object",
     *                 @OA\Property(property="total", type="integer")
     *             )
     *         )
     *     )
     * )
     *
     * @inheritDoc
     */
    public function getAll(): EndpointCollectionResult
    {
        $userSearchParamHolder = new UserSearchFilterParams();
        $this->setSortingAndPaginationParams($userSearchParamHolder);
        $userSearchParamHolder->setStatus(
            $this->getRequestParams()->getBooleanOrNull(
                RequestParams::PARAM_TYPE_QUERY,
                self::FILTER_STATUS
            )
        );
        $userSearchParamHolder->setUsername(
            $this->getRequestParams()->getStringOrNull(
                RequestParams::PARAM_TYPE_QUERY,
                self::FILTER_USERNAME
            )
        );
        $userSearchParamHolder->setUserRoleId(
            $this->getRequestParams()->getIntOrNull(
                RequestParams::PARAM_TYPE_QUERY,
                self::FILTER_USER_ROLE_ID
            )
        );

        $users = $this->getUserService()->searchSystemUsers($userSearchParamHolder);
        $count = $this->getUserService()->getSearchSystemUsersCount($userSearchParamHolder);
        return new EndpointCollectionResult(
            UserModel::class,
            $users,
            new ParameterBag([CommonParams::PARAMETER_TOTAL => $count])
        );
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForGetAll(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            $this->getValidationDecorator()->notRequiredParamRule(
                new ParamRule(self::FILTER_USER_ROLE_ID, new Rule(Rules::POSITIVE))
            ),
            $this->getValidationDecorator()->notRequiredParamRule(
                new ParamRule(self::FILTER_USERNAME, new Rule(Rules::STRING_TYPE))
            ),
            new ParamRule(self::FILTER_STATUS, new Rule(Rules::BOOL_VAL)),
            ...$this->getSortingAndPaginationParamsRules(UserSearchFilterParams::ALLOWED_SORT_FIELDS)
        );
    }

    /**
     * @OA\Post(
     *     path="/api/v1/admin/users",
     *     tags={"Admin/Users"},
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="username", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="status", type="boolean"),
     *             @OA\Property(property="userRoleId", type="integer"),
     *             required={"username", "password", "status", "userRoleId", "empNumber"}
     *         )
     *     ),
     *     @OA\Response(response="200",
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="data",
     *                 ref="#/components/schemas/Admin-UserModel"
     *             ),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     )
     * )
     *
     * @inheritDoc
     */
    public function create(): EndpointResourceResult
    {
        $user = new User();
        $this->setUserParams($user);
        $user->setDateEntered($this->getDateTimeHelper()->getNow());
        $user->setCreatedBy($this->getAuthUser()->getUserId());

        $user = $this->getUserService()->saveSystemUser($user);
        return new EndpointResourceResult(UserModel::class, $user);
    }

    /**
     * @param User $user
     * @param bool $changePassword
     */
    public function setUserParams(User $user, bool $changePassword = true): void
    {
        $username = $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, self::PARAMETER_USERNAME);
        $userRoleId = $this->getRequestParams()->getInt(RequestParams::PARAM_TYPE_BODY, self::PARAMETER_USER_ROLE_ID);
        $status = $this->getRequestParams()->getBoolean(RequestParams::PARAM_TYPE_BODY, self::PARAMETER_STATUS);

        $user->setUserName($username);
        $user->setStatus($status);
        $user->getDecorator()->setUserRoleById($userRoleId);
        if ($changePassword) {
            $password = $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, self::PARAMETER_PASSWORD);
            $user->getDecorator()->setNonHashedPassword($password);
        }
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForCreate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            ...$this->getUsernameAndPasswordRule(false),
            ...$this->getCommonBodyValidationRules(),
        );
    }

    /**
     * @return ParamRule[]
     */
    private function getCommonBodyValidationRules(): array
    {
        return [
            new ParamRule(
                self::PARAMETER_USER_ROLE_ID,
                new Rule(Rules::INT_TYPE)
            ),
            new ParamRule(
                self::PARAMETER_STATUS,
                new Rule(Rules::BOOL_TYPE)
            ),
        ];
    }

    /**
     * @param bool $update
     * @return ParamRule[]
     */
    protected function getUsernameAndPasswordRule(bool $update): array
    {
        $passwordConstructor = [true];
        $entityProperties = new EntityUniquePropertyOption();
        $entityProperties->setIgnoreValues(['isDeleted' => true]);
        $uniquePropertyParams = [User::class, 'userName', $entityProperties];
        if ($update) {
            $entityProperties->setIgnoreValues(
                [
                    'getId' => $this->getRequestParams()->getInt(
                        RequestParams::PARAM_TYPE_ATTRIBUTE,
                        CommonParams::PARAMETER_ID
                    ),
                    'isDeleted' => true,
                ]
            );

            $passwordConstructor = [
                $this->getRequestParams()->getBoolean(
                    RequestParams::PARAM_TYPE_BODY,
                    self::PARAMETER_CHANGE_PASSWORD
                )
            ];
        }

        return [
            new ParamRule(
                self::PARAMETER_USERNAME,
                new Rule(Rules::STRING_TYPE),
                new Rule(Rules::LENGTH, [self::PARAM_RULE_USERNAME_MIN_LENGTH, self::PARAM_RULE_USERNAME_MAX_LENGTH]),
                new Rule(Rules::ENTITY_UNIQUE_PROPERTY, $uniquePropertyParams)
            ),
            new ParamRule(
                self::PARAMETER_PASSWORD,
                new Rule(Rules::STRING_TYPE),
                new Rule(Rules::LENGTH, [null, self::PARAM_RULE_PASSWORD_MAX_LENGTH]),
                new Rule(Rules::PASSWORD, $passwordConstructor)
            )
        ];
    }

    /**
     * @OA\Put(
     *     path="/api/v1/admin/users/{id}",
     *     tags={"Admin/Users"},
     *     @OA\PathParameter(
     *         name="id",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="username", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="status", type="boolean"),
     *             @OA\Property(property="userRoleId", type="integer"),
     *             @OA\Property(property="empNumber", type="integer"),
     *             required={"username", "password", "status", "userRoleId", "empNumber"}
     *         )
     *     ),
     *     @OA\Response(response="200",
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="data",
     *                 ref="#/components/schemas/Admin-UserModel"
     *             ),
     *             @OA\Property(property="meta", type="object")
     *         )
     *     ),
     *     @OA\Response(response="404", ref="#/components/responses/RecordNotFound")
     * )
     *
     * @inheritDoc
     */
    public function update(): EndpointResourceResult
    {
        $userId = $this->getRequestParams()->getInt(RequestParams::PARAM_TYPE_ATTRIBUTE, CommonParams::PARAMETER_ID);
        $changePassword = $this->getRequestParams()->getBoolean(
            RequestParams::PARAM_TYPE_BODY,
            self::PARAMETER_CHANGE_PASSWORD
        );

        $user = $this->getUserService()->getSystemUser($userId);
        $this->throwRecordNotFoundExceptionIfNotExist($user, User::class);

        $this->setUserParams($user, $changePassword);
        $user->setDateModified($this->getDateTimeHelper()->getNow());
        $user->setModifiedUserId($this->getAuthUser()->getUserId());
        $user = $this->getUserService()->saveSystemUser($user);
        return new EndpointResourceResult(UserModel::class, $user);
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForUpdate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(
                CommonParams::PARAMETER_ID,
                new Rule(Rules::POSITIVE)
            ),
            new ParamRule(
                self::PARAMETER_CHANGE_PASSWORD,
                new Rule(Rules::BOOL_TYPE)
            ),
            ...$this->getUsernameAndPasswordRule(true),
            ...$this->getCommonBodyValidationRules(),
        );
    }

    /**
     * @OA\Delete(
     *     path="/api/v1/admin/users/{id}",
     *     tags={"Admin/Users"},
     *     @OA\RequestBody(ref="#/components/requestBodies/DeleteRequestBody"),
     *     @OA\Response(response="200", ref="#/components/responses/DeleteResponse")
     * )
     *
     * @inheritDoc
     */
    public function delete(): EndpointResourceResult
    {
        $ids = $this->getRequestParams()->getArray(RequestParams::PARAM_TYPE_BODY, CommonParams::PARAMETER_IDS);
        $this->getUserService()->deleteSystemUsers($ids);
        return new EndpointResourceResult(ArrayModel::class, $ids);
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForDelete(): ParamRuleCollection
    {
        $undeletableIds = $this->getUserService()->getUndeletableUserIds();
        return new ParamRuleCollection(
            new ParamRule(
                CommonParams::PARAMETER_IDS,
                new Rule(
                    Rules::EACH,
                    [
                        new Rules\Composite\AllOf(
                            new Rule(Rules::POSITIVE),
                            new Rule(Rules::NOT_IN, [$undeletableIds])
                        )
                    ]
                )
            ),
        );
    }
}
