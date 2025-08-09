<?php

namespace Optimust\Core\Controller\Common;

use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\React\Component;
use Optimust\Framework\Http\Request;

class NoRecordsFoundController extends AbstractReactController
{
    /**
     * @inheritDoc
     */
    public function preRender(Request $request): void
    {
        $component = new Component('no-records-found');
        $this->setComponent($component);
    }
}
