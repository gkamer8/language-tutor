from flask import (
    Blueprint,
    render_template,
    request,
    current_app,
    jsonify
)
from .prompts import EXPLAIN
import openai
import json
from flask_cors import cross_origin


bp = Blueprint('files', __name__)


TEST_FILE = """
# Au Soudan, la rivalité entre deux généraux a explosé, des forces paramilitaires disent contrôler l’aéroport international de Khartoum

Les soldats du général Daglo affirment avoir aussi pris le contrôle du palais présidentiel. L’armée accuse les paramilitaires d’avoir attaqué des bases dans tout le pays.

La tension était latente depuis des semaines. La rivalité entre les deux généraux à l’origine du putsch au Soudan en octobre 2021 a explosé, samedi 15 avril, à Khartoum, qui s’est réveillée au son des explosions et des combats, tuant au moins trois civils et un officier, selon le syndicat officiel des médecins. L’armée soudanaise a envoyé son aviation contre les paramilitaires qui disent avoir pris le contrôle de l’aéroport et du palais présidentiel de Khartoum, dans l’épisode le plus violent de la rivalité entre ces deux hommes aux commandes du pays depuis le putsch.

Les Forces de soutien rapide (FSR) du général Mohammed Hamdan Daglo, dit « Hemetti », assurent tenir l’aéroport international et le palais présidentiel et appellent l’ensemble de la population, parmi laquelle les soldats, à se retourner contre l’armée. Hemetti a ensuite affirmé à la chaîne qatarie Al-Jazira que ses combattants « ne s’arrêteraient pas avant d’avoir pris le contrôle de l’ensemble des bases militaires », qualifiant son ancien allié et désormais rival, Abdel Fattah Abdelrahman Al-Bourhane, chef de l’armée et dirigeant de facto du Soudan depuis son coup d’Etat du 25 octobre 2021, de « criminel ayant détruit le pays ».

En face, l’armée a dit que son aviation menait des « opérations » contre l’« ennemi » et dément la prise de l’aéroport mais assure que les FSR s’y sont « infiltrées et ont incendié des avions civils, dont un de la Saudia Airlines » – un incident confirmé à Ryad. Elle assure en outre avoir toujours le contrôle du QG de son état-major. Les deux camps s’affrontent également aux abords du siège des médias d’Etat, rapportent des témoins à l’Agence France-Presse.

Lors du putsch d’octobre 2021, le chef de l’armée, Abdel Fattah Abdelrahman Al-Bourhane, et le patron des FSR étaient apparus ensemble, faisant front commun pour évincer les civils du pouvoir. Mais au fil du temps, Hemetti n’a cessé de dénoncer le coup d’Etat, de se ranger du côté des civils – donc contre l’armée dans les négociations politiques – et c’est désormais son différend avec le général Bourhane qui empêche toute solution de sortie de crise au Soudan. Depuis des jours, la rue bruissait de rumeurs sur une guérilla imminente entre les deux camps.

## L’ONU appelle à cesser « immédiatement » les combats
Samedi, le bras de fer politique a gagné la rue : dans plusieurs quartiers de Khartoum, des tirs et des explosions quasi ininterrompus ont fait trembler les habitants du pays, longtemps déchiré par la guerre et au ban des nations durant de longues années. Les FSR appellent la population à « se rallier à elles » et affirment aux militaires qu’elles ne « les visent pas eux, mais leur état-major qui les utilise pour rester sur son trône, quitte à mettre la stabilité du pays en péril ».


« Comme tous les Soudanais, je reste à l’abri », a tweeté l’ambassadeur américain, John Godfrey. « L’escalade des tensions entre militaires jusqu’à l’affrontement direct est extrêmement dangereuse. J’appelle les hauts commandants militaires à cesser immédiatement de se battre », a-t-il encore écrit. Washington, l’ONU, l’Union africaine et la Ligue arabe ont réclamé une cessation « immédiate » des hostilités, tandis que la Russie a appelé à des « mesures urgentes en vue d’un cessez-le-feu ». Chancelleries et forces politiques affirment s’activer à des médiations depuis plusieurs jours, jusqu’ici sans succès.

## « Un tournant dangereux et historique »

Les FSR se sont dites « surprises au matin par l’arrivée d’un important contingent de l’armée qui a assiégé leur camp de Soba ». De son côté, l’armée rétorque que ce sont les FSR qui ont commencé : « l’armée accomplit son devoir pour protéger la patrie », a assuré le porte-parole de l’armée, le général Nabil Abdallah. Selon lui, les combats à Khartoum ont en réalité éclaté quand les FSR ont attaqué des bases de l’armée « à Khartoum et ailleurs au Soudan ».

Jeudi, l’armée dénonçait déjà un déploiement « dangereux » des paramilitaires à Khartoum et dans d’autres villes du Soudan « sans l’approbation ni la moindre coordination avec le commandement des forces armées ». Elle tirait alors « la sonnette d’alarme » face à « un tournant dangereux et historique ».

Car depuis des jours, alors que civils et communauté internationale étaient forcés d’accepter un nouveau report de la signature d’un accord politique censé sortir le pays de l’impasse – à cause des divergences entre les deux généraux –, des vidéos ne cessaient de montrer à partir de différents quartiers, l’arrivée de très nombreux blindés et d’hommes, notamment à Khartoum. L’avenir des paramilitaires est désormais la principale question au Soudan : tout retour à la transition démocratique est suspendu à leur intégration au sein des troupes régulières.

Si l’armée ne la refuse pas, elle veut malgré tout imposer ses conditions d’admission et limiter dans le temps l’incorporation de celles-ci. Le général Daglo, lui, réclame une inclusion large et, surtout, sa place au sein de l’état-major. C’est ce différend qui bloque toujours le retour à la transition exigée par la communauté internationale pour reprendre son aide au Soudan, l’un des pays les plus pauvres au monde.

"""

@bp.route('/files', methods=('GET',))
@cross_origin()
def files():
    # Test placeholder
    file_text = TEST_FILE  # string
    return jsonify({"status": "success", "file_content": file_text})
