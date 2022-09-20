<?php 

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber {
    public function updateJwtData(JWTCreatedEvent $event) 
    {
        //1 .Récupérer l'utilisateur pour avaoir (first name et last name)
        $user = $event->getUser();
        //2. Enrichir les data pour qu'elles contiennent ces données
        $data = $event->getData();
        $data['firstName'] = $user->getFirstname();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);
    }
}