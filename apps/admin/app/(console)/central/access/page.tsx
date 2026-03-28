import { ConsoleShell } from '../../../../src/components/console-shell';

export default function CentralAccessPage() {
  return (
    <ConsoleShell
      eyebrow="Acessos"
      title="Gestão de usuários e vínculos"
      description="Tela base para roles administrativas, vínculo com barracas e fronteira entre contexts."
      cards={[
        {
          title: 'Usuarios admin',
          value: '11',
          hint: 'Contas com acesso administrativo configurado.',
        },
        {
          title: 'Managers',
          value: '9',
          hint: 'Gestores vinculados às barracas.',
        },
        {
          title: 'Operators',
          value: '17',
          hint: 'Perfis operacionais ativos.',
        },
      ]}
    />
  );
}
