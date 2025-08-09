<?php

namespace Optimust\Core\Service;

use Optimust\Core\Api\V1\Serializer\NormalizerTrait;

class NormalizerService
{
    use NormalizerTrait;

    /**
     * @param string $modelClass
     * @param object|int|string $data
     * @return array
     */
    public function normalize(string $modelClass, $data): array
    {
        $this->setModelClass($modelClass);
        $this->setData($data);
        return $this->normalizeObject();
    }

    /**
     * @param string $modelClass
     * @param array $data
     * @return array
     */
    public function normalizeArray(string $modelClass, array $data): array
    {
        $this->setModelClass($modelClass);
        $this->setData($data);
        return $this->normalizeObjectsArray();
    }
}
