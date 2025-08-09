<?php

namespace Optimust\Authentication\Controller;

use Optimust\Authentication\Traits\CsrfTokenManagerTrait;
use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\Controller\PublicControllerInterface;
use Optimust\Core\Service\EmailService;
use Optimust\Core\React\Component;
use Optimust\Core\React\Prop;
use Optimust\Framework\Http\Request;

class RequestPasswordController extends AbstractReactController implements PublicControllerInterface
{
    use CsrfTokenManagerTrait;

    protected ?EmailService $emailService = null;

    /**
     * @return EmailService
     */
    public function getEmailService(): EmailService
    {
        if (!$this->emailService instanceof EmailService) {
            $this->emailService = new EmailService();
        }
        return $this->emailService;
    }

    /**
     * @inheritDoc
     */
    public function preRender(Request $request): void
    {
        if ($this->getEmailService()->isConfigSet()) {
            $component = new Component('request-reset-password');
            $component->addProp(
                new Prop(
                    'token',
                    Prop::TYPE_STRING,
                    $this->getCsrfTokenManager()->getToken('request-reset-password')->getValue()
                )
            );
        } else {
            $component = new Component('email-configuration-warning');
        }

        $this->setTemplate('no_header.html.twig');
        $this->setComponent($component);
    }
}
