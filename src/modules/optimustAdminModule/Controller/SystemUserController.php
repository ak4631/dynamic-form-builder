<?php

namespace Optimust\Admin\Controller;

use Optimust\Admin\Traits\Service\UserServiceTrait;
use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\React\Component;
use Optimust\Core\React\Prop;
use Optimust\Framework\Http\Request;

class SystemUserController extends AbstractReactController
{
    use UserServiceTrait;

    /**
     * @inheritDoc
     */
    public function preRender(Request $request): void
    {
        $component = new Component('system-user-list');
        $component->addProp(new Prop('unselectable-ids', Prop::TYPE_ARRAY, $this->getUserService()->getUndeletableUserIds()));
        $this->setComponent($component);
    }
}
