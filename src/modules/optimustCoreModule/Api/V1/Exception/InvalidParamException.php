<?php

namespace Optimust\Core\Api\V1\Exception;

use Exception;
use Throwable;

class InvalidParamException extends Exception
{
    public const DEFAULT_ERROR_MESSAGE = "Invalid Parameter";

    /**
     * @var array
     */
    protected array $errorBag = [];

    /**
     * @param array $errorBag
     * @param string $message
     * @param int $code
     * @param Throwable|null $previous
     */
    public function __construct(
        array $errorBag = [],
        $message = self::DEFAULT_ERROR_MESSAGE,
        $code = 0,
        Throwable $previous = null
    ) {
        $this->errorBag = $errorBag;
        parent::__construct($message, $code, $previous);
    }

    /**
     * @return array
     */
    public function getErrorBag(): array
    {
        return $this->errorBag;
    }

    /**
     * @param array $errorBag
     */
    public function setErrorBag(array $errorBag): void
    {
        $this->errorBag = $errorBag;
    }

    /**
     * @return array
     */
    public function getNormalizedErrorBag(): array
    {
        return [
            'invalidParamKeys' => array_keys($this->getErrorBag()),
        ];
    }
}
