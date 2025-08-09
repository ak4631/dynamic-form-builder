<?php

namespace Optimust\Admin\Api;

use Optimust\Admin\Traits\Service\UserServiceTrait;
use Optimust\Core\Api\V1\Endpoint;
use Optimust\Core\Api\V1\EndpointResourceResult;
use Optimust\Core\Api\V1\EndpointResult;
use Optimust\Core\Api\V1\Model\ArrayModel;
use Optimust\Core\Api\V1\RequestParams;
use Optimust\Core\Api\V1\ResourceEndpoint;
use Optimust\Core\Api\V1\Validator\ParamRule;
use Optimust\Core\Api\V1\Validator\ParamRuleCollection;
use Optimust\Core\Api\V1\Validator\Rule;
use Optimust\Core\Api\V1\Validator\Rules;
use Optimust\Entity\User;

class ValidationUserNameAPI extends Endpoint implements ResourceEndpoint
{
    use UserServiceTrait;

    public const PARAMETER_USER_NAME = 'userName';
    public const PARAMETER_USER_Id = 'userId';
    public const PARAMETER_IS_CHANGEABLE_USERNAME = 'valid';

    public const PARAM_RULE_USER_NAME_MAX_LENGTH = 40;

    /**
     * @OA\Get(
     *     path="/api/v1/admin/validation/user-name",
     *     tags={"Admin/Users"},
     *     @OA\Parameter(
     *         name="userName",
     *         in="query",
     *         required=true,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="userId",
     *         in="query",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="valid", type="boolean")
     *             )
     *         )
     *     )
     * )
     *
     * @inheritDoc
     */
    public function getOne(): EndpointResult
    {
        $userName = $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_QUERY, self::PARAMETER_USER_NAME);
        $userId = $this->getRequestParams()->getIntOrNull(RequestParams::PARAM_TYPE_QUERY, self::PARAMETER_USER_Id);
        if (!is_null($userId)) {
            $user = $this->getUserService()->geUserDao()->getSystemUser($userId);
            $this->throwRecordNotFoundExceptionIfNotExist($user, User::class);
        }
        $isChangeableUserName = !$this->getUserService()
            ->geUserDao()
            ->isUserNameExistByUserName($userName, $userId);
        return new EndpointResourceResult(
            ArrayModel::class,
            [
                self::PARAMETER_IS_CHANGEABLE_USERNAME => $isChangeableUserName,
            ]
        );
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForGetOne(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(
                self::PARAMETER_USER_NAME,
                new Rule(Rules::STRING_TYPE),
                new Rule(Rules::LENGTH, [null, self::PARAM_RULE_USER_NAME_MAX_LENGTH]),
            ),
            $this->getValidationDecorator()->notRequiredParamRule(
                new ParamRule(
                    self::PARAMETER_USER_Id,
                    new Rule(Rules::POSITIVE),
                )
            )
        );
    }

    /**
     * @inheritDoc
     */
    public function update(): EndpointResult
    {
        throw $this->getNotImplementedException();
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForUpdate(): ParamRuleCollection
    {
        throw $this->getNotImplementedException();
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
