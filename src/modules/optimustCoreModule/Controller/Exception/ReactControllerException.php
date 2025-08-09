<?php

namespace Optimust\Core\Controller\Exception;

use Exception;

class ReactControllerException extends Exception
{
    /**
     * @return static
     */
    public static function alreadyHandled(): self
    {
        return new self("Request already handled, cannot change the component");
    }
}
