<?php

namespace Optimust\Core\Api\V1\Validator\Rules;

class EntityIdExistsOption
{
    private bool $numeric = true;

    private bool $positive = true;

    /**
     * @return bool
     */
    public function isNumeric(): bool
    {
        return $this->numeric;
    }

    /**
     * @param bool $numeric
     * @return $this
     */
    public function setNumeric(bool $numeric): self
    {
        $this->numeric = $numeric;
        return $this;
    }

    /**
     * @return bool
     */
    public function isPositive(): bool
    {
        return $this->positive;
    }

    /**
     * @param bool $positive
     * @return $this
     */
    public function setPositive(bool $positive): self
    {
        $this->positive = $positive;
        return $this;
    }
}
