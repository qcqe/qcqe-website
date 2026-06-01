import React from 'react';
import { Container, Section } from '@shared/components/Layout';
import { Card, CardTitle, CardDescription } from '@shared/components/UI';
import { Button } from '@shared/components/UI';
import { MetaHead } from '@shared/components/SEO';
import { MetaGenerator } from '@seo/metaGenerator';
import { yeslonConfig as config } from '@sites/yeslon/data/config';
import { solutions } from '@sites/yeslon/data/solutions';
import { cases } from '@sites/yeslon/data/cases';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const metaGenerator = new MetaGenerator(config);
  const meta = metaGenerator.generate({
    path: '',
    title: '首页'
  });

  return (
    <>
      <MetaHead meta={meta} siteName={config.siteName} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid-pattern"></div>
        </div>
        <Container className="relative">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              {config.siteName}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              {config.description}
            </p>
            <div className="flex gap-4">
              <Button size="large" className="bg-white text-primary-600 hover:bg-gray-100">
                了解更多
              </Button>
              <Button size="large" variant="outline" className="border-white text-white hover:bg-white/10">
                联系我们
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <Section className="bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">核心优势</h2>
          <p className="text-xl text-gray-600">行业领先的技术实力和解决方案</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.features.map((feature, index) => (
            <Card key={index} hover className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 text-2xl">✓</span>
              </div>
              <CardTitle>{feature}</CardTitle>
            </Card>
          ))}
        </div>
      </Section>

      {/* Solutions Section */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">技术方案</h2>
          <p className="text-xl text-gray-600">覆盖多个行业的数字化转型解决方案</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.slice(0, 6).map((solution) => (
            <Card key={solution.id} hover>
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 mb-4"></div>
              <CardTitle>{solution.title}</CardTitle>
              <CardDescription>{solution.description}</CardDescription>
              <div className="mt-4">
                <Link to={`/solutions/${solution.slug}`} className="text-primary-600 hover:underline">
                  了解详情 →
                </Link>
              </div>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="large">
            查看所有方案
          </Button>
        </div>
      </Section>

      {/* Cases Section */}
      <Section className="bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">成功案例</h2>
          <p className="text-xl text-gray-600">已成功为众多行业客户提供解决方案</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.slice(0, 3).map((caseItem) => (
            <Card key={caseItem.id} hover>
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-40 mb-4"></div>
              <CardTitle>{caseItem.title}</CardTitle>
              <CardDescription>{caseItem.description}</CardDescription>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-primary-600 text-white">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">准备好开始您的数字化转型了吗？</h2>
          <p className="text-xl text-primary-100 mb-8">联系我们，获取专业的技术咨询和解决方案</p>
          <Button size="large" className="bg-white text-primary-600 hover:bg-gray-100">
            立即咨询
          </Button>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <Container>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{config.siteName}</h3>
              <p className="text-gray-400">{config.description}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">联系方式</h4>
              <p className="text-gray-400">电话: {config.contact.phone}</p>
              <p className="text-gray-400">邮箱: {config.contact.email}</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">快速链接</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/solutions" className="hover:text-white">解决方案</Link></li>
                <li><Link to="/cases" className="hover:text-white">成功案例</Link></li>
                <li><Link to="/about" className="hover:text-white">关于我们</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">{config.contact.workingHours}</h4>
              <p className="text-gray-400">{config.contact.address}</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2024 {config.siteName} 版权所有
          </div>
        </Container>
      </footer>
    </>
  );
};
