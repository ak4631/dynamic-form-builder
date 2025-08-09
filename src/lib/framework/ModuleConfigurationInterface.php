<?php

namespace Optimust\Framework;

use Optimust\Framework\Http\Request;

interface ModuleConfigurationInterface
{
    /**
     * Initialize module
     */
    public function initialize(Request $request): void;
}
