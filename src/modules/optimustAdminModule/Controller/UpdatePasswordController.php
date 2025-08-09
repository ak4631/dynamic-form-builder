<?php

namespace Optimust\Admin\Controller;

use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\Traits\UserRoleManagerTrait;
use Optimust\Core\React\Component;
use Optimust\Core\React\Prop;
use Optimust\Framework\Http\Request;

class UpdatePasswordController extends AbstractReactController
{
    use UserRoleManagerTrait;

    /**
     * @inheritDoc
     */
    public function preRender(Request $request): void
    {
        $userName = $this->getUserRoleManager()->getUser()->getUserName();
        $component = new Component('update-password');
        $component->addProp(new Prop('user-name', Prop::TYPE_STRING, $userName));
        $this->setComponent($component);
    }
}
