<?php

namespace Optimust\Core\Api\V1\Model;

use Optimust\Core\Api\V1\Serializer\Normalizable;

class ArrayModel implements Normalizable
{
    /**
     * @var array
     */
    protected array $data;

    /**
     * @param array $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        return $this->data;
    }
}
