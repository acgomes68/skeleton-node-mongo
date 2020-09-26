import Sequelize from 'sequelize';
import * as Yup from 'yup';
import User from '../models/User';

const { Op } = Sequelize;

module.exports = {
    async index(req, res) {
        try {
            const user = await User.findAll();
            return res.json(user);
        } catch (error) {
            return res.status(502).json({ error });
        }
    },
    async show(req, res) {
        const { id } = req.params;

        try {
            const user = await User.findByPk(id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.json(user);
        } catch (error) {
            return res.status(502).json({ error });
        }
    },
    async store(req, res) {
        const { name, email } = req.body;
        const schema = Yup.object().shape({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid e-Mail'),
        });

        if (!(await schema.isValid(req.body))) {
            return res
                .status(400)
                .json({ error: 'Posted data validation failed' });
        }

        try {
            const hasName = await User.findOne({
                where: { name },
            });
            if (hasName) {
                return res
                    .status(400)
                    .json({ error: 'User name already exists' });
            }

            const user = await User.create({
                name,
                email,
            });

            if (user) {
                return res.status(201).json(user);
            }

            return res
                .status(400)
                .json({ error: 'Errors encountered while adding user' });
        } catch (error) {
            return res.status(502).json({ error });
        }
    },
    async update(req, res) {
        const { id } = req.params;
        const schema = Yup.object().shape({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid e-Mail'),
        });

        if (!(await schema.isValid(req.body))) {
            return res
                .status(400)
                .json({ error: 'Posted data validation failed' });
        }

        const { name, email } = req.body;

        try {
            const user = await User.findByPk(id);

            if (user) {
                const hasName = await User.findOne({
                    where: { name, id: { [Op.ne]: id } },
                });

                if (hasName) {
                    return res
                        .status(400)
                        .json({ error: 'User name already exists' });
                }

                const hasEmail = await User.findOne({
                    where: { email, id: { [Op.ne]: id } },
                });

                if (hasEmail) {
                    return res
                        .status(400)
                        .json({ error: 'User e-mail already exists' });
                }

                await user.update(req.body);

                if (user) {
                    return res.status(202).json(user);
                }

                return res
                    .status(400)
                    .json({ error: 'Errors founded while updating user' });
            }

            return res.status(400).json({ error: 'User not found' });
        } catch (error) {
            return res.status(502).json({ error });
        }
    },
    async destroy(req, res) {
        const { id } = req.params;
        try {
            const hasUser = await User.findByPk(id);

            if (hasUser) {
                const user = await User.destroy({ where: { id } });
                if (user) {
                    return res
                        .status(203)
                        .json({ msg: 'User deleted sucessfully' });
                }

                return res
                    .status(400)
                    .json({ error: 'Errors founded while erasing user' });
            }

            return res.status(400).json({ error: 'User not found' });
        } catch (error) {
            return res.status(502).json({ error });
        }
    },
};
