<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use Closure;
use DateTime;

class LessThanOrEqual extends AbstractRule
{
    private $targetObject;

    /**
     * @param Closure|DateTime|float|int $targetObject
     */
    public function __construct($targetObject)
    {
        $this->targetObject = $targetObject;
    }

    /**
     * @inheritDoc
     */
    public function validate($input): bool
    {
        $targetObject = $this->targetObject;
        if (is_callable($targetObject)) {
            $targetObject = $targetObject();
        }
        if ($targetObject instanceof DateTime) {
            $input = new DateTime($input);
        }
        return $input <= $targetObject;
    }
}
