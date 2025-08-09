<?php

namespace Optimust\Core\Api\V1\Validator\Helpers;

trait IsEmptyTrait
{
    /**
     * @param mixed $value
     * @return bool
     */
    private function isEmpty($value): bool
    {
        return in_array($value, [null, ''], true);
    }
}
