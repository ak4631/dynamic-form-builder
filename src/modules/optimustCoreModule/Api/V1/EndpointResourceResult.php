<?php

namespace Optimust\Core\Api\V1;

use Optimust\Core\Api\V1\Serializer\AbstractEndpointResult;
use Optimust\Core\Api\V1\Serializer\NormalizeException;

class EndpointResourceResult extends AbstractEndpointResult
{
    /**
     * @inheritDoc
     * @throws NormalizeException
     */
    public function normalize(): array
    {
        return $this->normalizeObject();
    }
}
