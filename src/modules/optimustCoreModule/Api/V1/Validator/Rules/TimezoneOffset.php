<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

class TimezoneOffset extends AbstractRule
{
    public const WESTERNMOST_TIMEZONE_OFFSET = -12.00;
    public const EASTERN_MOST_TIMEZONE_OFFSET = 14.00;

    /**
     * @inheritDoc
     */
    public function validate($input): bool
    {
        if (!(
            is_numeric($input) &&
            $input >= self::WESTERNMOST_TIMEZONE_OFFSET &&
            $input <= self::EASTERN_MOST_TIMEZONE_OFFSET
        )) {
            return false;
        }
        return true;
    }
}
