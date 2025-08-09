<?php

namespace Optimust\ORM\Exception;

use Exception;
use Throwable;

class TransactionException extends Exception
{
    /**
     * @param Throwable $previous
     * @param string $message
     * @param int $code
     */
    public function __construct(Throwable $previous, $message = 'Transaction Failed', $code = 0)
    {
        parent::__construct($message, $code, $previous);
    }
}
