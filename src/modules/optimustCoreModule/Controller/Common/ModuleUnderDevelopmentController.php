<?php

namespace Optimust\Core\Controller\Common;

use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\React\Component;
use Optimust\Framework\Http\Request;

class ModuleUnderDevelopmentController extends AbstractReactController
{
    /**
     * @inheritDoc
     */
    public function preRender(Request $request): void
    {
        $component = new Component('module-under-development');
        $this->setComponent($component);
    }
}
