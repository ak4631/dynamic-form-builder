<?php

namespace Optimust\Core\Traits;

use Optimust\Core\Api\V1\Exception\InvalidParamException;
use Optimust\Core\Api\V1\Validator\ParamRuleCollection;
use Optimust\Core\Api\V1\Validator\Validator;
use Optimust\Core\Api\V1\Validator\ValidatorException;

trait ValidatorTrait
{
    /**
     * @param array $values
     * @param ParamRuleCollection|null $rules
     * @return bool
     * @throws InvalidParamException
     * @throws ValidatorException
     */
    protected function validate(array $values, ?ParamRuleCollection $rules = null): bool
    {
        return Validator::validate($values, $rules);
    }
}
