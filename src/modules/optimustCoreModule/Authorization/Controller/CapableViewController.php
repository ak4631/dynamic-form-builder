<?php

namespace Optimust\Core\Authorization\Controller;

use Optimust\Framework\Http\Request;

interface CapableViewController
{
    /**
     * @param Request $request
     * @return bool
     */
    public function isCapable(Request $request): bool;
}
