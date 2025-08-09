<?php

namespace Optimust\Authentication\Controller;

use Optimust\Authentication\Service\ResetPasswordService;
use Optimust\Authentication\Traits\CsrfTokenManagerTrait;
use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\Controller\PublicControllerInterface;
use Optimust\Core\React\Component;
use Optimust\Core\React\Prop;
use Optimust\Entity\User;
use Optimust\Framework\Http\Request;

class ResetCodeController extends AbstractReactController implements PublicControllerInterface
{
    use CsrfTokenManagerTrait;

    protected ?ResetPasswordService $resetPasswordService = null;

    /**
     * @return ResetPasswordService
     */
    public function getResetPasswordService(): ResetPasswordService
    {
        if (!$this->resetPasswordService instanceof ResetPasswordService) {
            $this->resetPasswordService = new ResetPasswordService();
        }
        return $this->resetPasswordService;
    }

    /**
     * @inheritDoc
     */
    public function preRender(Request $request): void
    {
        $resetCode = $request->attributes->get('resetCode');
        $user = $this->getResetPasswordService()->validateUrl($resetCode);

        if ($user instanceof User) {
            $component = new Component('reset-password');
            $component->addProp(
                new Prop('username', Prop::TYPE_STRING, $user->getUserName())
            );
            $component->addProp(
                new Prop(
                    'token',
                    Prop::TYPE_STRING,
                    $this->getCsrfTokenManager()->getToken('reset-password')->getValue()
                )
            );
        } else {
            $component = new Component('reset-password-error');
        }

        $this->setComponent($component);

        $this->setTemplate('no_header.html.twig');
    }
}
