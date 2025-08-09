<?php

namespace Optimust\Admin\Controller;

use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\React\Component;
use Optimust\Core\React\Prop;
use Optimust\Framework\Http\Request;

class SaveSystemUserController extends AbstractReactController
{
    public function preRender(Request $request): void
    {
        if ($request->attributes->has('id')) {
            $component = new Component('system-user-edit');
            $component->addProp(new Prop('system-user-id', Prop::TYPE_NUMBER, $request->attributes->getInt('id')));
        } else {
            $component = new Component('system-user-save');
        }
        $this->setComponent($component);
    }
}
