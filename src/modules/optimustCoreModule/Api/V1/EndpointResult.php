<?php

namespace Optimust\Core\Api\V1;

interface EndpointResult
{
    /**
     * Normalize object to associative array
     * @return array
     */
    public function normalize(): array;

    /**
     * @return ParameterBag|null
     */
    public function getMeta(): ?ParameterBag;

    /**
     * @return ParameterBag|null
     */
    public function getRels(): ?ParameterBag;
}
