<?php

namespace Optimust\Admin\Api;

use Optimust\Admin\Api\Model\UserModel;
use Optimust\Admin\Traits\Service\UserServiceTrait;
use Optimust\Core\Api\CommonParams;
use Optimust\Core\Api\V1\Endpoint;
use Optimust\Core\Api\V1\EndpointResourceResult;
use Optimust\Core\Api\V1\EndpointResult;
use Optimust\Core\Api\V1\RequestParams;
use Optimust\Core\Api\V1\ResourceEndpoint;
use Optimust\Core\Api\V1\Validator\ParamRule;
use Optimust\Core\Api\V1\Validator\ParamRuleCollection;
use Optimust\Core\Api\V1\Validator\Rule;
use Optimust\Core\Api\V1\Validator\Rules;
use Optimust\Core\Traits\UserRoleManagerTrait;

class UpdatePasswordAPI extends Endpoint implements ResourceEndpoint
{
    use UserRoleManagerTrait;
    use UserServiceTrait;

    public const PARAMETER_CURRENT_PASSWORD = 'currentPassword';
    public const PARAMETER_NEW_PASSWORD = 'newPassword';

    public const PARAM_RULE_PASSWORD_MAX_LENGTH = 64;

    /**
     * @inheritDoc
     */
    public function getOne(): EndpointResult
    {
        throw $this->getNotImplementedException();
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        throw $this->getNotImplementedException();
    }

    /**
     * @OA\Put(
     *     path="/api/v1/admin/update-password",
     *     tags={"Admin/Update Password"},
     *     summary="Update Password",
     *     operationId="update-password",
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(
     *                 property="currentPassword",
     *                 type="string",
     *                 maxLength=Optimust\Admin\Api\UpdatePasswordAPI::PARAM_RULE_PASSWORD_MAX_LENGTH
     *             ),
     *             @OA\Property(
     *                 property="newPassword",
     *                 type="string",
     *                 maxLength=Optimust\Admin\Api\UpdatePasswordAPI::PARAM_RULE_PASSWORD_MAX_LENGTH
     *             ),
     *             required={"currentPassword", "newPassword"},
     *         )
     *     ),
     *     @OA\Response(response="200",
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="data",
     *                 ref="#/components/schemas/Admin-UserModel"
     *             ),
     *         )
     *     ),
     * )
     *
     * @inheritDoc
     */
    public function update(): EndpointResult
    {
        $user = $this->getUserRoleManager()->getUser();
        $newPassword = $this->getRequestParams()->getString(
            RequestParams::PARAM_TYPE_BODY,
            self::PARAMETER_NEW_PASSWORD
        );
        $user->getDecorator()->setNonHashedPassword($newPassword);
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
                CommonParams::PARAMETER_ID
            ),
            $this->getValidationDecorator()->requiredParamRule(
                new ParamRule(
                    self::PARAMETER_CURRENT_PASSWORD,
                    new Rule(Rules::STRING_TYPE),
                    new Rule(Rules::LENGTH, [null, self::PARAM_RULE_PASSWORD_MAX_LENGTH]),
                    new Rule(Rules::CALLBACK, [
                        function () {
                            $currentPassword = $this->getRequestParams()->getString(
                                RequestParams::PARAM_TYPE_BODY,
                                self::PARAMETER_CURRENT_PASSWORD
                            );
                            $userId = $this->getUserRoleManager()->getUser()->getId();
                            return $this->getUserService()->isCurrentPassword($userId, $currentPassword);
                        }
                    ])
                )
            ),
            $this->getValidationDecorator()->requiredParamRule(
                new ParamRule(
                    self::PARAMETER_NEW_PASSWORD,
                    new Rule(Rules::STRING_TYPE),
                    new Rule(Rules::LENGTH, [null, self::PARAM_RULE_PASSWORD_MAX_LENGTH]),
                    new Rule(Rules::PASSWORD, [true])
                ),
            ),
        );
    }

    /**
     * @inheritDoc
     */
    public function delete(): EndpointResult
    {
        throw $this->getNotImplementedException();
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForDelete(): ParamRuleCollection
    {
        throw $this->getNotImplementedException();
    }
}
