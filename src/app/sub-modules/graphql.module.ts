

import { environment			} from '../../environments/environment';
import { NgModule				} from '@angular/core';
import { HttpClientModule		} from '@angular/common/http';
import { InMemoryCache			} from '@apollo/client/core';
import { ApolloClientOptions	} from '@apollo/client/core';
import { ApolloModule			} from 'apollo-angular';
import { APOLLO_OPTIONS			} from 'apollo-angular';
import { HttpLink				} from 'apollo-angular/http';

const uri = 'http://localhost:5430/api/tab/Presbies/query';
function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
	return {cache: new InMemoryCache(), link: httpLink.create({ uri })}
}

@NgModule({
	exports:	[ApolloModule, HttpClientModule],
	providers:	[{provide: APOLLO_OPTIONS, useFactory: createApollo, deps: [HttpLink]}]
})
export class GraphqlModule {}

