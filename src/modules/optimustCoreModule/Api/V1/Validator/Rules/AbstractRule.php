<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use Optimust\Core\Api\V1\Validator\Exceptions\ValidationException;
use Respect\Validation\Exceptions\ValidationException as RespectValidationException;
use Respect\Validation\Rules\AbstractRule as RespectAbstractRule;

abstract class AbstractRule extends RespectAbstractRule
{
    /**
     * @inheritDoc
     * @throws ValidationException
     */
    public function reportError($input, array $extraParams = []): RespectValidationException
    {
        throw new ValidationException($input, $this);
    }
}
