<?php

namespace Optimust\Authentication\Controller;

use Optimust\Authentication\Auth\User as AuthUser;
use Optimust\Authentication\Traits\CsrfTokenManagerTrait;
use Optimust\Authentication\Traits\Service\PasswordStrengthServiceTrait;
use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\Controller\PublicControllerInterface;
use Optimust\Core\Traits\Auth\AuthUserTrait;
use Optimust\Core\React\Component;
use Optimust\Core\React\Prop;
use Optimust\Framework\Http\Request;

class WeakPasswordResetController extends AbstractReactController implements PublicControllerInterface
{
    use PasswordStrengthServiceTrait;
    use CsrfTokenManagerTrait;
    use AuthUserTrait;

    /**
     * @inheritDoc
     */
    public function preRender(Request $request): void
    {
        $this->getAuthUser()->getFlash(AuthUser::FLASH_LOGIN_ERROR);
        $resetCode = $request->attributes->get('resetCode');
        $component = new Component('reset-weak-password');
        if ($this->getPasswordStrengthService()->validateUrl($resetCode)) {
            $username = $this->getPasswordStrengthService()->getUserNameByResetCode($resetCode);
            $component->addProp(
                new Prop('username', Prop::TYPE_STRING, $username)
            );
            $component->addProp(
                new Prop('code', Prop::TYPE_STRING, $resetCode)
            );
            $component->addProp(
                new Prop(
                    'token',
                    Prop::TYPE_STRING,
                    $this->getCsrfTokenManager()->getToken('reset-weak-password')->getValue()
                )
            );
            if ($this->getAuthUser()->hasFlash(AuthUser::FLASH_PASSWORD_ENFORCE_ERROR)) {
                $error = $this->getAuthUser()->getFlash(AuthUser::FLASH_PASSWORD_ENFORCE_ERROR);
                $component->addProp(
                    new Prop(
                        'error',
                        Prop::TYPE_OBJECT,
                        $error[0] ?? []
                    )
                );
            }
        } else {
            $component->addProp(
                new Prop(
                    'invalid-code',
                    Prop::TYPE_BOOLEAN,
                    true
                )
            );
        }
        $this->setComponent($component);
        $this->setTemplate('no_header.html.twig');
    }
}
