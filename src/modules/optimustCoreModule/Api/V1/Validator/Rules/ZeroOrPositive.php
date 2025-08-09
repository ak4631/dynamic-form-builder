<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

class ZeroOrPositive extends AbstractRule
{
    /**
     * @inheritDoc
     */
    public function validate($input): bool
    {
        if (!is_numeric($input)) {
            return false;
        }
        return $input >= 0;
    }
}
