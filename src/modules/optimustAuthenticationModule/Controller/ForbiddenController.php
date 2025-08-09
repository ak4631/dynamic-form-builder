<?php

namespace Optimust\Authentication\Controller;

use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\Controller\PublicControllerInterface;
use Optimust\Core\React\Component;
use Optimust\Framework\Http\Request;

class ForbiddenController extends AbstractReactController implements PublicControllerInterface
{
    /**
     * @inheritDoc
     */
    public function preRender(Request $request): void
    {
        $component = new Component('auth-forbidden');
        $this->setComponent($component);
    }
}
