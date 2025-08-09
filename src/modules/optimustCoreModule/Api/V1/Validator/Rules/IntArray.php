<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

class IntArray extends AbstractRule
{
    /**
     * @inheritDoc
     */
    public function validate($input): bool
    {
        if (!is_array($input)) {
            return false;
        }

        foreach ($input as $value) {
            if (!is_int($value)) {
                return false;
            }
        }
        return true;
    }
}
