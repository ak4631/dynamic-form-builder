<?php

namespace Optimust\Authentication\Controller;

use Optimust\Authentication\Dto\UserCredential;
use Optimust\Authentication\Exception\AuthenticationException;
use Optimust\Authentication\Service\ResetPasswordService;
use Optimust\Authentication\Traits\CsrfTokenManagerTrait;
use Optimust\Core\Controller\AbstractController;
use Optimust\Core\Controller\PublicControllerInterface;
use Optimust\Framework\Http\RedirectResponse;
use Optimust\Framework\Http\Request;
use Optimust\Framework\Services;

class ResetPasswordController extends AbstractController implements PublicControllerInterface
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
     * @param Request $request
     * @return RedirectResponse
     */
    public function handle(Request $request): RedirectResponse
    {
        $token = $request->request->get('_token');

        if (!$this->getCsrfTokenManager()->isValid('reset-password', $token)) {
            throw AuthenticationException::invalidCsrfToken();
        }
        $username = $request->request->get('username');
        $password = $request->request->get('password');
        $credentials = new UserCredential($username, $password);
        $this->getResetPasswordService()->saveResetPassword($credentials);
        $session = $this->getContainer()->get(Services::SESSION);
        $session->invalidate();
        return $this->redirect("auth/login");
    }
}
