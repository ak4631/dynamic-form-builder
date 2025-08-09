<?php

namespace Optimust\Core\Api\V1;

class Response
{
    public const CONTENT_TYPE_KEY = 'Content-Type';
    public const CONTENT_TYPE_JSON = 'application/json';
    /**
     * @var array
     */
    protected array $data;

    /**
     * @var array
     */
    protected array $rels;

    /**
     * @var array
     */
    protected array $meta;

    /**
     * @param array $data
     * @param array $meta
     * @param array $rels
     */
    public function __construct($data = [], $meta = [], $rels = [])
    {
        $this->data = $data;
        $this->meta = $meta;
        $this->rels = $rels;
    }

    /**
     * @return string
     */
    public function format(): string
    {
        return json_encode($this->data, true);
    }

    /**
     * @return string
     */
    public function formatData(): string
    {
        $responseFormat = [
            'data' => $this->data,
            'meta' => $this->meta,
            'rels' => $this->rels,
        ];
        return json_encode($responseFormat, true);
    }

    /**
     * @param $error
     * @return string
     */
    public static function formatError($error): string
    {
        return json_encode($error, true);
    }
}
