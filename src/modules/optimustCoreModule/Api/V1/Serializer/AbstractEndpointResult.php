<?php

namespace Optimust\Core\Api\V1\Serializer;

use Optimust\Core\Api\V1\EndpointResult;
use Optimust\Core\Api\V1\ParameterBag;

abstract class AbstractEndpointResult implements EndpointResult
{
    use NormalizerTrait;

    /**
     * @var ParameterBag|null
     */
    protected ?ParameterBag $meta = null;

    /**
     * @var ParameterBag|null
     */
    protected ?ParameterBag $rels = null;

    /**
     * AbstractEndpointResult constructor.
     * @param string $modelClass
     * @param array|object|string|int $data
     * @param ParameterBag|null $meta
     * @param ParameterBag|null $rels
     * @throws NormalizeException
     */
    public function __construct(string $modelClass, $data, ParameterBag $meta = null, ParameterBag $rels = null)
    {
        if (!class_exists($modelClass)) {
            throw new NormalizeException(
                sprintf('Could not found class `%s`. Hint: use fully qualified class name', $modelClass)
            );
        }
        $this->modelClass = $modelClass;
        $this->data = $data;
        $this->meta = $meta;
        $this->rels = $rels;
    }

    /**
     * Normalize object to associative array
     * @return array
     */
    abstract public function normalize(): array;

    /**
     * @return ParameterBag|null
     */
    public function getMeta(): ?ParameterBag
    {
        return $this->meta;
    }

    /**
     * @param ParameterBag|null $meta
     */
    public function setMeta(?ParameterBag $meta): void
    {
        $this->meta = $meta;
    }

    /**
     * @return ParameterBag|null
     */
    public function getRels(): ?ParameterBag
    {
        return $this->rels;
    }

    /**
     * @param ParameterBag|null $rels
     */
    public function setRels(?ParameterBag $rels): void
    {
        $this->rels = $rels;
    }
}
