import { Command } from 'commander';
import { SmiteApi } from '../../src';

const program = new Command();

const ARGS = {
  DEV_ID: '',
  AUTH_KEY: '',
};

program
  .option('-n, --dev_id <DEV_ID>', 'Specify the DEV_ID')
  .action((options) => {
    ARGS.DEV_ID = options.dev_id;
  })
  .option('-n, --auth_key <AUTH_KEY>', 'Specify the AUTH_KEY')
  .action((options) => {
    ARGS.AUTH_KEY = options.auth_key;
  });

program.parse(process.argv);

const { AUTH_KEY, DEV_ID } = ARGS;

const client = new SmiteApi({ auth_key: AUTH_KEY, dev_id: DEV_ID });

async function main() {
  const player = await client.getPlayer('dhko');
  console.log(player);
}

main();
