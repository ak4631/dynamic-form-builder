<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

use Closure;

class EntityUniquePropertyOption
{
    private bool $trim = true;

    private Closure $trimFunction;
    private ?array $ignoreValues;

    public function __construct()
    {
        $this->setTrimFunction(fn ($input) => trim($input));
        $this->ignoreValues = null;
    }

    /**
     * @return bool
     */
    public function isTrim(): bool
    {
        return $this->trim;
    }

    /**
     * @param bool $trim
     * @return $this
     */
    public function setTrim(bool $trim): self
    {
        $this->trim = $trim;
        return $this;
    }

    /**
     * @return Closure
     */
    public function getTrimFunction(): Closure
    {
        return $this->trimFunction;
    }

    /**
     * @param Closure $trimFunction
     *
     * e.g. 1;
     * $entityUniquePropertyOption->setTrimFunction(function ($input) {
     *     return trim($input);
     * });
     *
     * e.g. 2;
     * $entityUniquePropertyOption->setTrimFunction(fn($input) => rtrim($input));
     *
     * @return $this
     */
    public function setTrimFunction(Closure $trimFunction): self
    {
        $this->trimFunction = $trimFunction;
        return $this;
    }

    /**
     * @return bool
     */
    public function hasIgnoreValues(): bool
    {
        return isset($this->ignoreValues);
    }

    /**
     * @param array $ignoreValues
     * Getter method => value (if this value is set, entity is ignored)
     * E.g: ['isDeleted' => true, 'getId' => 11]
     */
    public function setIgnoreValues(array $ignoreValues): self
    {
        $this->ignoreValues = $ignoreValues;
        return $this;
    }

    /**
     * @return array
     */
    public function getIgnoreValues(): array
    {
        return $this->ignoreValues;
    }
}
