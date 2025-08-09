<?php

namespace Optimust\Core\Registration\Service;

use Exception;
use GuzzleHttp\Client;
use Optimust\Config\Config;
use Optimust\Core\Traits\LoggerTrait;

class RegistrationAPIClientService
{
    use LoggerTrait;

    private ?Client $apiClient = null;
    
    /**
     * @return Client
     */
    private function getApiClient(): Client
    {
        if (!$this->apiClient instanceof Client) {
            $this->apiClient = new Client(['base_uri' => Config::REGISTRATION_URL, 'verify' => false]);
        }
        return $this->apiClient;
    }

    /**
     * @param array $data
     * @return bool
     */
    public function publishData(array $data): bool
    {
        try {
            $headers = [
                'Content-Type' => 'application/x-www-form-urlencoded',
            ];
            $response = $this->getApiClient()->post(
                '',
                [
                    'headers' => $headers,
                    'form_params' => $data,
                ]
            );

            return $response->getStatusCode() == 200;
        } catch (Exception $e) {
            $this->getLogger()->error($e->getMessage());
            $this->getLogger()->error($e->getTraceAsString());
            return false;
        }
    }
}
