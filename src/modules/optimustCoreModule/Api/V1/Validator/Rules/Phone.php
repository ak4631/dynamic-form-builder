<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

class Phone extends AbstractRule
{
    private const PHONE_REGEX = "/^[0-9+\-\/() ]+$/";

    /**
     * @inheritDoc
     */
    public function validate($input): bool
    {
        if (!is_scalar($input)) {
            return false;
        }

        if ((string) $input === "") {
            return true;
        }

        return preg_match(self::PHONE_REGEX, (string) $input) > 0;
    }
}
