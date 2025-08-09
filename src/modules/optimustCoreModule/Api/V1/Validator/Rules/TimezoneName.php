<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use DateTimeZone;
use Exception;

class TimezoneName extends AbstractRule
{
    /**
     * @inheritDoc
     */
    public function validate($input): bool
    {
        if (!(is_string($input) && $this->isValidTimezone($input))) {
            return false;
        }
        return true;
    }

    /**
     * @param string $timezoneName
     * @return bool
     */
    private function isValidTimezone(string $timezoneName): bool
    {
        try {
            new DateTimeZone($timezoneName);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
}
