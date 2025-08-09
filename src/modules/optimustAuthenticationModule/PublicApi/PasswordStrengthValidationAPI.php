<?php

namespace Optimust\Authentication\PublicApi;

use Optimust\Authentication\Dto\UserCredential;
use Optimust\Authentication\Traits\Service\PasswordStrengthServiceTrait;
use Optimust\Authentication\Utility\PasswordStrengthValidation;
use Optimust\Core\Api\V1\CollectionEndpoint;
use Optimust\Core\Api\V1\Endpoint;
use Optimust\Core\Api\V1\EndpointResourceResult;
use Optimust\Core\Api\V1\EndpointResult;
use Optimust\Core\Api\V1\Model\ArrayModel;
use Optimust\Core\Api\V1\ParameterBag;
use Optimust\Core\Api\V1\RequestParams;
use Optimust\Core\Api\V1\Validator\ParamRule;
use Optimust\Core\Api\V1\Validator\ParamRuleCollection;
use Optimust\Core\Api\V1\Validator\Rule;
use Optimust\Core\Api\V1\Validator\Rules;
use Optimust\Core\Traits\Service\ConfigServiceTrait;

class PasswordStrengthValidationAPI extends Endpoint implements CollectionEndpoint
{
    use ConfigServiceTrait;
    use PasswordStrengthServiceTrait;

    public const PARAMETER_PASSWORD = 'password';
    public const PARAMETER_PASSWORD_STRENGTH = 'strength';
    public const PARAMETER_MESSAGES = 'messages';

    /**
     * @inheritDoc
     */
    public function getAll(): EndpointResult
    {
        throw $this->getNotImplementedException();
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForGetAll(): ParamRuleCollection
    {
        throw $this->getNotImplementedException();
    }

    /**
     * @OA\Post(
     *     path="/api/v1/auth/validation/password",
     *     tags={"Authentication/Password Strength"},
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="password", type="string"),
     *             required={"name"}
     *         )
     *     ),
     *     @OA\Response(response="200",
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="messages", type="array",
     *                     @OA\Items(),
     *                     example="Your password must contain minimum 1 upper-case letter"
     *                 )
     *             ),
     *             @OA\Property(property="meta", type="object",
     *                 @OA\Property(property="strength", type="integer")
     *             )
     *         )
     *     )
     * )
     * @inheritDoc
     */
    public function create(): EndpointResult
    {
        $password = $this->getRequestParams()->getString(RequestParams::PARAM_TYPE_BODY, self::PARAMETER_PASSWORD);
        $credentials = new UserCredential(null, $password);

        $passwordStrengthValidation = new PasswordStrengthValidation();

        $passwordStrength = $passwordStrengthValidation->checkPasswordStrength($credentials);
        $messages = $this->getPasswordStrengthService()->checkPasswordPolicies($credentials, $passwordStrength);

        if (count($messages) > 0 && $passwordStrength > PasswordStrengthValidation::BETTER) {
            $passwordStrength = PasswordStrengthValidation::BETTER;
        }

        return new EndpointResourceResult(
            ArrayModel::class,
            [self::PARAMETER_MESSAGES => $messages],
            new ParameterBag([self::PARAMETER_PASSWORD_STRENGTH => $passwordStrength])
        );
    }

    /**
     * @inheritDoc
     */
    public function getValidationRuleForCreate(): ParamRuleCollection
    {
        return new ParamRuleCollection(
            new ParamRule(
                self::PARAMETER_PASSWORD,
                new Rule(Rules::STRING_TYPE),
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
