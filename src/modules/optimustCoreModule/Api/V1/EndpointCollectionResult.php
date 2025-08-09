<?php

namespace Optimust\Core\Api\V1;

use Optimust\Core\Api\V1\Serializer\AbstractEndpointResult;
use Optimust\Core\Api\V1\Serializer\CollectionNormalizable;
use Optimust\Core\Api\V1\Serializer\NormalizeException;

class EndpointCollectionResult extends AbstractEndpointResult
{
    /**
     * @inheritDoc
     * @throws NormalizeException
     */
    public function normalize(): array
    {
        if (in_array(CollectionNormalizable::class, array_values(class_implements($this->modelClass)))) {
            return $this->normalizeObject();
        }
        return $this->normalizeObjectsArray();
    }
}
