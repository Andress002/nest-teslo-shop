import { SetMetadata } from '@nestjs/common';

export const MESSAGE_KEY = 'message';

export const Message = (message: string) => SetMetadata(MESSAGE_KEY, message);

//este decorador guarda un mensaje personalizado en los metadatos de la función o clase a la que se aplica. Luego, este mensaje puede ser recuperado y utilizado en otras partes de la aplicación, como en interceptores, guardias o filtros, para proporcionar información adicional sobre la operación que se está realizando.
// a diferencia de otros decoradores personalizados que puedes extraer información de los parámetros o del contexto de ejecución, este decorador simplemente almacena un mensaje estático que se puede usar para describir la función o clase a la que se aplica. Es útil para agregar información descriptiva o contextual que puede ser utilizada en otras partes de la aplicación.
