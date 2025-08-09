<?php

namespace Optimust\Authentication\Controller;

use Optimust\Authentication\Auth\User as AuthUser;
use Optimust\Authentication\Traits\CsrfTokenManagerTrait;
use Optimust\Config\Config;
use Optimust\Core\Authorization\Service\HomePageService;
use Optimust\Core\Controller\AbstractReactController;
use Optimust\Core\Controller\PublicControllerInterface;
use Optimust\Core\Traits\Auth\AuthUserTrait;
use Optimust\Core\Traits\EventDispatcherTrait;
use Optimust\Core\React\Component;
use Optimust\Core\React\Prop;
use Optimust\Framework\Http\Request;

class LoginController extends AbstractReactController implements PublicControllerInterface
{
    use AuthUserTrait;
    use EventDispatcherTrait;
    use CsrfTokenManagerTrait;

    /**
     * @var HomePageService|null
     */
    protected ?HomePageService $homePageService = null;

    /**
     * @return HomePageService
     */
    public function getHomePageService(): HomePageService
    {
        if (!$this->homePageService instanceof HomePageService) {
            $this->homePageService = new HomePageService();
        }
        return $this->homePageService;
    }

    /**
     * @inheritDoc
     */
    public function preRender(Request $request): void
    {
        $component = new Component('auth-login');
        if ($this->getAuthUser()->hasFlash(AuthUser::FLASH_LOGIN_ERROR)) {
            $error = $this->getAuthUser()->getFlash(AuthUser::FLASH_LOGIN_ERROR);
            $component->addProp(
                new Prop(
                    'error',
                    Prop::TYPE_OBJECT,
                    $error[0] ?? []
                )
            );
        }

        $component->addProp(
            new Prop(
                'token',
                Prop::TYPE_STRING,
                $this->getCsrfTokenManager()->getToken('login')->getValue()
            )
        );
        $component->addProp(
            new Prop('login-logo-src', Prop::TYPE_STRING, $request->getBasePath() . '/images/logo.png')
        );
        $component->addProp(new Prop('is-demo-mode', Prop::TYPE_BOOLEAN, Config::PRODUCT_MODE === Config::MODE_DEMO));
        $this->setComponent($component);
        $this->setTemplate('no_header.html.twig');
    }

    /**
     * @inheritDoc
     */
    public function handle(Request $request)
    {
        if ($this->getAuthUser()->isAuthenticated()) {
            $homePagePath = $this->getHomePageService()->getHomePagePath();
            return $this->redirect($homePagePath);
        }
        return parent::handle($request);
    }
}
