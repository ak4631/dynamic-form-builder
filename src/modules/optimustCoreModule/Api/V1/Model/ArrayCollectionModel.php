<?php

namespace Optimust\Core\Api\V1\Model;

use Optimust\Core\Api\V1\Serializer\CollectionNormalizable;

class ArrayCollectionModel implements CollectionNormalizable
{
    /**
     * @var array
     */
    protected array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function toArray(): array
    {
        return $this->data;
    }
}
