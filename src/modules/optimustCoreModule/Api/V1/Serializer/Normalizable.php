<?php

namespace Optimust\Core\Api\V1\Serializer;

interface Normalizable
{
    /**
     * Object normalize to an array
     * @return array
     */
    public function toArray(): array;
}
