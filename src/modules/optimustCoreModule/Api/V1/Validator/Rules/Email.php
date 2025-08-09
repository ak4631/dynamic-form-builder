<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

class Email extends AbstractRule
{
    /**
     * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#basic_validation
     */
    public const EMAIL_REGEX = '/^[a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/';

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

        return preg_match(self::EMAIL_REGEX, (string) $input) > 0;
    }
}
