<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use Optimust\Core\Api\V1\Validator\Helpers\IsEmptyTrait;

class NotRequired extends AbstractRule
{
    use IsEmptyTrait;

    /**
     * @var bool
     */
    private bool $excludeEmptyString;

    /**
     * @param bool $excludeEmptyString
     */
    public function __construct(bool $excludeEmptyString = false)
    {
        $this->excludeEmptyString = $excludeEmptyString;
    }

    /**
     * @param mixed $input
     * @return bool
     */
    public function validate($input): bool
    {
        if ($this->excludeEmptyString) {
            return is_null($input);
        }
        return $this->isEmpty($input);
    }
}
