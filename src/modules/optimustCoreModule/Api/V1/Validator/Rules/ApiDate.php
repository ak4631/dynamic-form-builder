<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use Respect\Validation\Helpers\CanValidateDateTime;

class ApiDate extends AbstractRule
{
    use CanValidateDateTime;

    /**
     * @var string
     */
    private string $format = 'Y-m-d';

    /**
     * {@inheritDoc}
     */
    public function validate($input): bool
    {
        if (!is_scalar($input)) {
            return false;
        }
        return $this->isDateTime($this->format, (string)$input);
    }
}
