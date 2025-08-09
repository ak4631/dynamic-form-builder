<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use InvalidArgumentException;
use Optimust\Core\Traits\Service\TextHelperTrait;

class StrLength extends AbstractRule
{
    use TextHelperTrait;

    private ?int $minValue;
    private ?int $maxValue;
    private ?string $encoding;
    private bool $inclusive;

    public function __construct(?int $min = null, ?int $max = null, ?string $encoding = null, bool $inclusive = true)
    {
        $this->minValue = $min;
        $this->maxValue = $max;
        $this->encoding = $encoding;
        $this->inclusive = $inclusive;

        if ($max !== null && $min > $max) {
            throw new InvalidArgumentException('Max value should be greater than Min value');
        }
    }

    /**
     * @inheritDoc
     */
    public function validate($input): bool
    {
        $length = $this->getTextHelper()->strLength($input, $this->encoding);
        return $this->validateMin($length) && $this->validateMax($length);
    }

    /**
     * @param int $length
     * @return bool
     */
    private function validateMin(int $length): bool
    {
        if ($this->minValue === null) {
            return true;
        }

        return $this->inclusive ? ($length >= $this->minValue) : ($length > $this->minValue);
    }

    /**
     * @param int $length
     * @return bool
     */
    private function validateMax(int $length): bool
    {
        if ($this->maxValue === null) {
            return true;
        }

        return $this->inclusive ? ($length <= $this->maxValue) : ($length < $this->maxValue);
    }
}
