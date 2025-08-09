<?php

namespace Optimust\Authentication\Controller;

use Optimust\Admin\Traits\Service\UserServiceTrait;
use Optimust\Authentication\Auth\User as AuthUser;
use Optimust\Authentication\Dto\UserCredential;
use Optimust\Authentication\Exception\AuthenticationException;
use Optimust\Authentication\Traits\CsrfTokenManagerTrait;
use Optimust\Authentication\Traits\Service\PasswordStrengthServiceTrait;
use Optimust\Core\Controller\AbstractController;
use Optimust\Core\Controller\PublicControllerInterface;
use Optimust\Core\Traits\Auth\AuthUserTrait;
use Optimust\Entity\User;
use Optimust\Framework\Http\RedirectResponse;
use Optimust\Framework\Http\Request;
use Optimust\Framework\Routing\UrlGenerator;
use Optimust\Framework\Services;

class RequestResetWeakPasswordController extends AbstractController implements PublicControllerInterface
{
    use PasswordStrengthServiceTrait;
    use CsrfTokenManagerTrait;
    use UserServiceTrait;
    use AuthUserTrait;

    /**
     * @param Request $request
     * @return RedirectResponse
     */
    public function handle(Request $request): RedirectResponse
    {
        $currentPassword = $request->request->get('currentPassword');
        $username = $request->request->get('username');
        $password = $request->request->get('password');
        $resetCode = $request->request->get('resetCode');
        $token = $request->request->get('_token');

        $user = $this->getUserService()->geUserDao()->getUserByUserName($username);

        /** @var UrlGenerator $urlGenerator */
        $urlGenerator = $this->getContainer()->get(Services::URL_GENERATOR);
        $redirectUrl = $urlGenerator->generate(
            'auth_weak_password_reset',
            ['resetCode' => $resetCode],
            UrlGenerator::ABSOLUTE_URL
        );

        if (!$this->getCsrfTokenManager()->isValid('reset-weak-password', $token)) {
            $this->getAuthUser()->addFlash(
                AuthUser::FLASH_PASSWORD_ENFORCE_ERROR,
                [
                    'error' => AuthenticationException::INVALID_CSRF_TOKEN,
                    'message' => 'CSRF token validation failed',
                ]
            );
            return new RedirectResponse($redirectUrl);
        }

        if (!$this->getPasswordStrengthService()->validateUrl($resetCode)) {
            $this->getAuthUser()->addFlash(
                AuthUser::FLASH_PASSWORD_ENFORCE_ERROR,
                [
                    'error' => AuthenticationException::INVALID_RESET_CODE,
                    'message' => 'Invalid password reset code'
                ]
            );
            return new RedirectResponse($redirectUrl);
        }

        if (!$user instanceof User || !$this->getUserService()->isCurrentPassword($user->getId(), $currentPassword)) {
            $this->getAuthUser()->addFlash(
                AuthUser::FLASH_PASSWORD_ENFORCE_ERROR,
                [
                    'error' => AuthenticationException::INVALID_CREDENTIALS,
                    'message' => 'Invalid credentials',
                ]
            );
            return new RedirectResponse($redirectUrl);
        } else {
            $credentials = new UserCredential($username, $password);
            $this->getPasswordStrengthService()->saveEnforcedPassword($credentials);
            return $this->redirect("auth/login");
        }
    }
}
