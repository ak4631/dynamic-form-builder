<?php

namespace Optimust\Core\Mail;

use Exception;
use Throwable;

class TemplateRenderException extends Exception
{
    /**
     * @param Throwable $previous
     * @param string $message
     * @param int $code
     */
    public function __construct(Throwable $previous, $message = '', $code = 0)
    {
        parent::__construct($message, $code, $previous);
    }
}
