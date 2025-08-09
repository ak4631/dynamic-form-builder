<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

class NotIn extends AbstractRule
{
    /**
     * @var array
     */
    private array $haystack;

    /**
     * @var bool
     */
    private bool $compareIdentical;

    /**
     * @param array $haystack
     * @param bool $compareIdentical
     */
    public function __construct(array $haystack, bool $compareIdentical = false)
    {
        $this->haystack = $haystack;
        $this->compareIdentical = $compareIdentical;
    }

    /**
     * @inheritDoc
     */
    public function validate($input): bool
    {
        return !in_array($input, $this->haystack, $this->compareIdentical);
    }
}
